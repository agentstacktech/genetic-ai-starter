# Genetic AI Starter Kit install wrapper
$Dir = Split-Path -Parent $MyInvocation.MyCommand.Path
& node (Join-Path $Dir "scripts/install.mjs") @args
exit $LASTEXITCODE
