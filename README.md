# travis-rancher-deployer
A project to automate deployments to a Rancher 1.6 private cloud via TravisCI

## Usage

To use this project, you should install it as part of your build process. For example under yarn: `yarn global add @base-cms/travis-rancher-deployer`.

You can then use the `deploy-to-rancher` command from the CLI. The command expects the following arguments:

- image: The docker image to deploy, e.g; `base-cms/parcel-plug:v1`
- service: The Rancher service label value to target.

```yaml
# travis.yml
deploy:
  -
    provider: script
    script: cd scripts/deploy.sh
    on:
      tags: true
      condition: "$TRAVIS_TAG =~ ^v[0-9]+\\.[0-9]+\\.[0-9]+$"
```

```sh
# scripts/deploy.sh
#!/bin/sh
yarn global add @base-cms/travis-rancher-deployer
deploy-to-rancher "myorg/my-image:${TRAVIS_TAG}" "what-to-upgrade"
```

This project uses `envalid` to ensure that the following required deployment parameters have been specified. You can set these in your Travis env matrix, or via the TravisCI repository settings.

```bash
RANCHER_URI=https://my_rancher_url/v2-beta/projects/my_project_id
RANCHER_ACCESS_KEY=my_access_key
RANCHER_SECRET_KEY=my_secret_key
```

Using the configuration above will search for services using a label of `service=what-to-upgrade` and upgrade them to `myorg/my-image:${TRAVIS_TAG}`.
