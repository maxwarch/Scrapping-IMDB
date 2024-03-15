FROM mongo

# create directory for the app user
# RUN mkdir -p /home/app

# # create the app user
# RUN addgroup --system app && adduser --system --group app

# # create the appropriate directories
# ENV HOME=/home/app
# WORKDIR $HOME

# COPY entrypoint.sh $HOME
# RUN chmod +x entrypoint.sh

# USER app

COPY entrypoint.js /docker-entrypoint-initdb.d
#RUN chmod +x entrypoint.sh

#ENTRYPOINT ./entrypoint.sh