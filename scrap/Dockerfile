FROM python:3.11.0-slim

ENV PYTHONUNBUFFERED 1

# create directory for the app user
RUN mkdir -p /home/app

# create the app user
RUN addgroup --system app && adduser --system --group app

# create the appropriate directories
ENV HOME=/home/app
WORKDIR $HOME

COPY requirements.txt $HOME
RUN python -m pip install --upgrade pip 
RUN pip install --no-cache-dir -r requirements.txt

# copy project
COPY . $HOME

# chown all the files to the app user
RUN chown -R app:app $HOME

# change to the app user
USER app
CMD ["bash"]