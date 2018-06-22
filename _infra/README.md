This code runs on AWS Lambda@Edge to:

* Rewrite incoming requests so they get served from the correct SPA file
* Redirect the root (`/`) to a language-specific subdirectory based on the
  client's `Accept-Language` header.

Tip:

Have CloudFront have a separate behaviour for `/` that whitelists the
`Accept-Language` header. The remainder should disregard all headers.
