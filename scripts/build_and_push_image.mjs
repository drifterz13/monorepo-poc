#!/usr/bin/env zx

const SERVICES = ['school-web', 'school-core-api']
const DOCKER_USERNAME = 'sklmix' // TODO: Change this to GCP docker username.
const ENVIRONMENT = 'dev'

const TARGET_SERVICES = argv.packages.filter((pkg) =>
  SERVICES.includes(pkg.name),
)

for (const SERVICE of TARGET_SERVICES) {
  const SERVICE_NAME = SERVICE.name
  const SERVICE_VERSION = SERVICE.version

  await $`docker build . --target ${SERVICE_NAME} --tag ${SERVICE_NAME}:${SERVICE_VERSION}`
  await $`docker tag ${SERVICE_NAME}:${SERVICE_VERSION} ${DOCKER_USERNAME}/${SERVICE_NAME}:${SERVICE_VERSION}-${ENVIRONMENT}`
  await $`docker push ${DOCKER_USERNAME}/${SERVICE_NAME}:${SERVICE_VERSION}-${ENVIRONMENT}`
}
