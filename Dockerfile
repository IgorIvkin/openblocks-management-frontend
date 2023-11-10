# build application
FROM node:18-alpine3.18 as build
COPY . .
RUN npm run build

# deploy application
FROM nginx:stable-alpine
COPY --from=build /build /usr/share/nginx/html
COPY --from=build /nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]