FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=school-web --prod /prod/school-web
RUN pnpm deploy --filter=school-api --prod /prod/school-api

FROM nginx AS school-web
COPY --from=build /prod/school-web/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]

FROM base AS school-api
COPY --from=build /prod/school-api /prod/school-api
WORKDIR /prod/school-api
RUN pnpm add @nestjs/cli
EXPOSE 3000
CMD [ "pnpm", "start" ]