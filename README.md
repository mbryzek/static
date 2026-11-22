# static

Asset directories served as they are. janusz.bryzek.com lives in mbryzek/janusz (`site/`) and deploys from its `main`.

## Hot-linked paths

A path here that another repository links to on `raw.githubusercontent.com` is a contract: renaming
or deleting it breaks that consumer.

- `lakeviewsummit-ui/logo/logo.png`: the logo in every Lake View Summit email (platform's
  `lakeviewsummit/app/lakeviewsummit/email/layouts/LakeViewSummitLayout.scala`), shown at 80px. It is
  a 240px render (3x) of `lakeviewsummit-ui/logo/logo-1024.png`, so an email open downloads about
  80 KB rather than the 1.9 MB master.
