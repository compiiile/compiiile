FROM node:lts AS build

RUN npm install -g @compiiile/compiiile

WORKDIR /app
COPY . .
RUN compiiile build

FROM httpd:2.4 AS runtime
COPY --from=build /app/.compiiile/dist /usr/local/apache2/htdocs/
EXPOSE 80
