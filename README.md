# Virtual Optical Spectrum Analyzer
This analyzer is deployed at https://floating-ocean-85341.herokuapp.com/. The source code can be found at https://github.com/Donglin-Wang2/ciena-fall-2021-coop-challenge. This is my submission for the coding challenge for the Fall 2021 "Instrumentation Automation Developer" Co-op position at Ciena. This Virttual Optical Sepctrum Analyzer has the following features:
1. It allows users to **start and stop** tracing the device data at 1Hz.
2. It allows users to acuire a single trace from the remote device.
3. It allows users to send queries to the device.
4. It allows users to set the range of data to be received.
5. It will generate logs when the device fail to connect, timed out, or returns no data.
6. It allows to zoom in, zoom out, and download the graph as a screenshot 
![Virtual OSA's UI](./images/ui.png)
## Installation Guide
**Requirements: Make sure you have `npm` and `pip` installed**
1. Clone the repository onto your local machine.
2. In the root folder, run `npm install`. This will insall all modules needed to build and run the JavaScript frontend.
3. Run `python manage.py migrate` to apply all the migrations needed for Django to function properly.
4. Run `python manage.py runserver` to start the application on localhost. If your port 8000 is not occupied, then the application will be at `localhost:8000`.
If you want to change any part of the front-end code, be sure to run `npm run dev` in order to rebuild the JavaScript files along with React.js. If you want to change any part of the api, please run `python manage.py makemigrations` and then `python manage.py migrate` before running `python manage.py runserver`.

## API Endpoint


## Design choices
I chose to use React.js as the front-end library because its declarative programming paradigm and its state-oriented design. I used Django for backend becasue it offers a variety of production-ready features that I can use to create this app.
