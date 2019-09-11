# Karmen

[![Documentation Status](https://readthedocs.org/projects/karmen/badge/?version=latest)](https://karmen.readthedocs.io/en/latest/?badge=latest)
[![Build status](https://api.travis-ci.com/fragaria/karmen.svg?branch=master)](https://travis-ci.com/fragaria/karmen)

A common interface for multiple 3d printers.

## Description

This project contains

- [Backend service](./src/karmen_backend) that discovers and communicates with all the connected printers

## Prerequisites

## Installation

## Usage

For development with live reload (both backend and frontend), start this with the
following docker-compose command.

```sh
REACT_APP_GIT_REV=`git rev-parse --short HEAD` docker-compose -f docker-compose.dev.yml up
```

## Contributing

## Support

## License

All of the code herein is copyright 2019 [Fragaria s.r.o.](https://fragaria.cz) and released under the terms of the [GNU Affero General Public License, version 3](./LICENSE.txt).
