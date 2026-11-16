$ErrorActionPreference = 'Stop'

function Write-Info([string]$Message) { Write-Host "[ATLAS] $Message" -ForegroundColor Cyan }
function Write-Warn([string]$Message) { Write-Host "[ATLAS] $Message" -ForegroundColor Yellow }
function Write-Fail([string]$Message) { Write-Host "[ATLAS] $Message" -ForegroundColor Red }

try {
    $source = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
    if (-not (Test-Path (Join-Path $source 'package.json'))) {
        throw 'A pasta de origem não parece conter o projeto ATLAS (package.json ausente).'
    }

    Write-Host ''
    Write-Info 'Atualizador seguro do ATLAS Academy'
    Write-Host 'Informe o caminho da pasta do repositório ATLAS já clonado no Git.'
    $destinationInput = Read-Host 'Pasta do repositório'
    if ([string]::IsNullOrWhiteSpace($destinationInput)) { throw 'Nenhuma pasta foi informada.' }
    $destination = (Resolve-Path -LiteralPath $destinationInput).Path

    if ($destination.TrimEnd('\') -eq $source.TrimEnd('\')) {
        throw 'A origem e o destino são a mesma pasta. Extraia o pacote fora do repositório clonado.'
    }
    if (-not (Test-Path (Join-Path $destination 'package.json'))) {
        throw 'A pasta escolhida não contém package.json. Selecione a raiz do repositório ATLAS.'
    }
    if (-not (Test-Path (Join-Path $destination '.git'))) {
        throw 'A pasta selecionada não parece ser um repositório Git (.git ausente).'
    }

    $gitCommand = Get-Command git -ErrorAction SilentlyContinue
    if ($gitCommand) {
        $status = & git -C $destination status --porcelain 2>$null
        if ($LASTEXITCODE -eq 0 -and $status) {
            Write-Warn 'Há alterações locais não commitadas no repositório.'
            $continue = Read-Host 'Deseja continuar mesmo assim? (digite SIM para confirmar)'
            if ($continue -cne 'SIM') { throw 'Atualização cancelada para proteger alterações locais.' }
        }
    }

    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backup = Join-Path $env:TEMP "ATLAS-backup-$timestamp"
    $excludedDirectories = @('.git', 'node_modules', '.next', '.vercel')
    $excludedFiles = @('.env', '.env.local', '.env.production')
    $sourceFiles = Get-ChildItem -LiteralPath $source -File -Recurse | Where-Object {
        $relative = $_.FullName.Substring($source.Length).TrimStart('\','/')
        $parts = $relative -split '[\\/]'
        -not ($parts | Where-Object { $excludedDirectories -contains $_ }) -and
        -not ($excludedFiles -contains $_.Name) -and ($_.Name -eq '.env.example' -or $_.Name -notlike '.env*')
    }

    $overwritten = 0
    foreach ($file in $sourceFiles) {
        $relative = $file.FullName.Substring($source.Length).TrimStart('\','/')
        $targetFile = Join-Path $destination $relative
        if (Test-Path -LiteralPath $targetFile) {
            $backupFile = Join-Path $backup $relative
            $backupDirectory = Split-Path -Parent $backupFile
            New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null
            Copy-Item -LiteralPath $targetFile -Destination $backupFile -Force
            $overwritten++
        }
    }

    Write-Info "Backup das versões substituídas: $backup"
    $robocopyArgs = @(
        $source, $destination, '/E', '/R:2', '/W:1', '/COPY:DAT', '/DCOPY:DAT', '/NP',
        '/XD', '.git', 'node_modules', '.next', '.vercel',
        '/XF', '.env', '.env.*', 'tsconfig.tsbuildinfo'
    )
    & robocopy @robocopyArgs | Out-Host
    $copyExitCode = $LASTEXITCODE
    if ($copyExitCode -ge 8) { throw "Falha no Robocopy (código $copyExitCode). O backup permanece em $backup." }

    $exampleEnv = Join-Path $source '.env.example'
    if (Test-Path $exampleEnv) { Copy-Item -LiteralPath $exampleEnv -Destination (Join-Path $destination '.env.example') -Force }

    Write-Info 'Arquivos do ATLAS copiados.'
    Write-Info "Arquivos existentes protegidos em backup: $overwritten"
    Write-Host ''
    Write-Host 'Próximos passos:' -ForegroundColor Green
    Write-Host '  1. Abra um terminal na pasta do repositório.'
    Write-Host '  2. Execute: npm install'
    Write-Host '  3. Execute: npm run validate:all'
    Write-Host '  4. Execute: npm run typecheck'
    Write-Host '  5. Execute: npm run build'
    Write-Host '  6. Revise o diff antes de fazer commit e push.'
    Write-Warn 'Nenhum commit, push, migration ou deploy foi executado por este script.'
    Write-Host "Backup disponível em: $backup"
}
catch {
    Write-Fail $_.Exception.Message
    exit 1
}
