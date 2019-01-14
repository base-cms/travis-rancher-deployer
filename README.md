# travis-rancher-deployer
A project to automate deployments to a Rancher 1.6 private cloud via TravisCI

## Usage

To use this project, you should check it out within your project's Travis CI step. For example to deploy to your private cloud when matching a semver tag you could do the following:

```yaml
deploy:
  -
    provider: script
    script: cd scripts/deploy; yarn; yarn start
    on:
      tags: true
      condition: "$TRAVIS_TAG =~ ^v[0-9]+\\.[0-9]+\\.[0-9]+$"
```

This project uses `envalid` to ensure that the following required deployment parameters have been specified. You can set these in your Travis env matrix, or via the TravisCI repository settings.

```bash
RANCHER_URI=https://my_rancher_url/v2-beta/projects/my_project_id
RANCHER_ACCESS_KEY=my_access_key
RANCHER_SECRET_KEY=my_secret_key
SERVICE_TARGET=service_target_name
IMAGE_NAME=my_image_name
TRAVIS_TAG=some_tag_value
```

Using the configuration above will search for services using a label of `service=${SERVICE_TARGET}` and upgrade them to `${IMAGE_NAME}:${TRAVIS_TAG}`.
