#
# probe Dockerfile
#

# Pull base image nodejs image.
FROM node:18-alpine
USER root
RUN mkdir /tmp/npm &&  chmod 2777 /tmp/npm && chown 1000:1000 /tmp/npm && npm config set cache /tmp/npm --global


# Install bash. 
RUN apk update && apk add bash && apk add curl

#Use bash shell by default
SHELL ["/bin/bash", "-c"]


#SET ENV Variables
ENV PRODUCTION=true

RUN mkdir /usr/src

# Install common
RUN mkdir /usr/src/Common
WORKDIR /usr/src/Common
COPY ./Common/package*.json /usr/src/Common/
RUN npm install
COPY ./Common /usr/src/Common


# Install Model
RUN mkdir /usr/src/Model
WORKDIR /usr/src/Model
COPY ./Model/package*.json /usr/src/Model/
RUN npm install
COPY ./Model /usr/src/Model



# Install CommonServer
RUN mkdir /usr/src/CommonServer
WORKDIR /usr/src/CommonServer
COPY ./CommonServer/package*.json /usr/src/CommonServer/
RUN npm install
COPY ./CommonServer /usr/src/CommonServer





# Install app
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Install trivy for container scanning
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/master/contrib/install.sh | sh -s -- -b /usr/local/bin

# Install kubectl for kubernetes monitor scanning
RUN OS_ARCHITECTURE="amd64"
RUN if [[ "$(uname -m)" -eq "aarch64" ]] ; then OS_ARCHITECTURE="arm64" ; fi
RUN if [[ "$(uname -m)" -eq "arm64" ]] ; then OS_ARCHITECTURE="arm64" ; fi
RUN curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/$(OS_ARCHITECTURE)/kubectl"
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl && \
  chown root: /usr/local/bin/kubectl



# Install app dependencies
COPY ./Probe/package*.json /usr/src/app/
RUN npm install


# Expose ports.
#   - 3008: probe
EXPOSE 3008


{{ if eq .Env.ENVIRONMENT "development" }}
#Run the app
CMD [ "npm", "run", "dev" ]
{{ else }}
# Copy app source
COPY ./Probe /usr/src/app
# Bundle app source
RUN npm run compile
#Run the app
CMD [ "npm", "start" ]
{{ end }}

