# 下载精选建筑无水印图片（Wikimedia Commons 免费可商用）
# 在项目根目录运行: .\images\featured\download-images.ps1

$urls = @{
  "beijing-forbidden-city.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Gate_of_Supreme_Harmony_at_the_Forbidden_City.jpg/400px-Gate_of_Supreme_Harmony_at_the_Forbidden_City.jpg"
  "zhaozhou-bridge.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Zhaozhou_Bridge.jpg/400px-Zhaozhou_Bridge.jpg"
  "hongcun.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Ancient_Villages_in_Southern_Anhui_%E2%80%93_Xidi_and_Hongcun-114147.jpg/400px-Ancient_Villages_in_Southern_Anhui_%E2%80%93_Xidi_and_Hongcun-114147.jpg"
  "fujian-tulou.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Snail_pit_tulou.jpg/400px-Snail_pit_tulou.jpg"
  "lugou-bridge.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lugouqiao2.jpg/400px-Lugouqiao2.jpg"
  "chengde-resort.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Chengde_Mountain_Resort_1.jpg/400px-Chengde_Mountain_Resort_1.jpg"
}

$dir = $PSScriptRoot
foreach ($k in $urls.Keys) {
  $out = Join-Path $dir $k
  Write-Host "Downloading $k ..."
  try {
    Invoke-WebRequest -Uri $urls[$k] -OutFile $out -UseBasicParsing -TimeoutSec 30
    Write-Host "  OK"
  } catch {
    Write-Host "  Failed: $_"
  }
}
Write-Host "Done."
