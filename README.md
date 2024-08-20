# Feedbomb

Feedbomb is a simple and powerful RSS reader for the web. It is free, open-source, and supports Progressive Web Apps (PWA). 

## Features

- **Free and Open Source**: Completely open for use and modification.
- **Self-Hostable**: Host Feedbomb on your own server.
- **PWA Support**: Works as a Progressive Web App.
- **Built-in article reader**: Read articles with our simple and modern reader.
- **Modern UI**: Feedbomb has a modern UI that is easy to use.
- **Much more coming soon**

## Usage

1. **Access Feedbomb**: Go to [feedbomb.app](https://www.feedbomb.app).
2. **Add Feeds**: Click "Add feed" in the sidebar to add RSS/Atom feeds.

## Self-Hosting

To self-host Feedbomb, follow these steps:

1. **Clone the Repository**: Copy the `src` folder from this repository. This folder contains the client-side code only.
2. **Set Up the Server**: The client-side code connects to server endpoints by default. Below is an example of how to set up our server endpoints using Express:

    ```js
    const express = require('express');
    const cors = require('cors');
    const axios = require('axios');

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());

    app.get('/getFeed', (req, res) => {
      const url = req.query.url;

      if (!url) {
        return res.status(400).send('URL is required');
      }

      axios.get(url)
        .then(response => {
          res.set('Content-Type', 'application/xml');
          res.send(response.data);
        })
        .catch(error => {
          res.status(500).send(error.toString());
        });
    });

    app.get('/fetchArticleText', (req, res) => {
      const url = req.query.url;
      axios.get(url)
        .then(response => {
          res.set('Access-Control-Allow-Origin', '*');
          res.set('Content-Type', 'text/plain');
          res.send(response.data);
        })
        .catch(error => {
          res.status(500).send(error);
        });
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/georg-stone/feedbomb/blob/main/LICENSE) file for details.

## Contributions

We welcome contributions! If you have suggestions or improvements, please:

- **Open an Issue**: [Create an issue](https://github.com/georg-stone/quicktodo/issues).
- **Submit a Pull Request**: [Submit a pull request](https://github.com/georg-stone/quicktodo/pulls).
