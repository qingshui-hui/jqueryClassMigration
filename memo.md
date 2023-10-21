
F-RevoCRMのlayoutsをダウンロード

```bash
git clone --no-checkout --depth=1 https://github.com/thinkingreed-inc/F-RevoCRM.git frevocrm
cd frevocrm
git config core.sparsecheckout true
git sparse-checkout set /layouts/v7/modules
git sparse-checkout set /layouts/v7/resources
git checkout
```
