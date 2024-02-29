---
title: "Installing GDAL on Uberspace 7"
author: Christian Engel
type: post
date: 2023-01-27T09:07:45+01:00
image: feature.png
caption: "GDAL on Uberspace 7"
categories:
  - Tutorials
  - Spatial Stuff
tags:
  - GDAL
  - GEOS
  - Proj
  - CMAKE
  - OGR
  - Uberspace
description: How to install a current version of GDAL on Uberspace 7 shared hosting.
syndication:
  twitter: https://twitter.com/DeEgge/status/1618913507508117505
  mastodon: https://fosstodon.org/@chringel/109760609842691086
---

I was pleasantly surprised to find out that [Uberspace 🚀](https://uberspace.de/en/) now has lots of precompiled extensions for PostgreSQL 🐘. And among them is PostGIS 🗺️! There's also a [dedicated section in the installation manual](https://lab.uberspace.de/guide_postgresql/#postgis-spatially-enabling-the-database-using-postgis). That's pretty handy, if you want to store spatial data in your database. But how do you import spatial data? You can't always rely on `shp2pgsql`. We need some proper `ogr2ogr`. We need [GDAL](https://gdal.org/)!

Here are the steps to **install GDAL on Uberspace 7**. This is heavily based on [Alex Bilz' tutorial](https://www.alexbilz.com/post/2020-08-18-install-postgis-on-uberspace/), but updated for recent versions, especially of _Proj_ and _GDAL_ itself.

## Get current CMAKE

As of writing this post, Uberspace hosts a relatively old version of CMAKE (2.8.x), but in order to compile _Proj_ and _GDAL_, we need at least version 3.4.

```shell
wget https://github.com/Kitware/CMake/releases/download/v3.17.3/cmake-3.17.3-Linux-x86_64.sh
bash cmake-3.17.3-Linux-x86_64.sh --skip-license --prefix=$HOME
rm cmake-3.17.3-Linux-x86_64.sh
hash -r

# Test
cmake --version
cmake version 3.17.3
```

## Install GEOS

```shell
mkdir geos && cd geos
curl -O http://download.osgeo.org/geos/geos-3.11.1.tar.bz2
tar -vxf geos-3.11.1.tar.bz2
cd geos-3.11.1
./configure --prefix=$HOME/opt/geos/build --enable-python
make && make install

# Test
opt/geos/build/bin/geos-config --version
3.11.1
```

## Install Proj

```shell
cd ~
mkdir proj && cd proj
curl -O http://download.osgeo.org/proj/proj-9.1.1.tar.gz
tar -vxf proj-9.1.1.tar.gz
cd proj-9.1.1
mkdir build && cd build
cmake .. -DCMAKE_INSTALL_PREFIX=$HOME/opt/proj
cmake --build .
cmake --build . --target install

# Test
opt/proj/bin/proj
Rel. 9.1.1, December 1st, 2022
```

**Note**: I ran into trouble while compiling _Proj_, or, to be more precise: I ran out of memory. If you see that the compiling process gets killed, you probably need to disable some currently running processes using `supervisorctl stop`.

## GDAL

```shell
cd ~
mkdir gdal && cd gdal
curl -O http://download.osgeo.org/gdal/3.6.2/gdal-3.6.2.tar.gz
tar -xvf gdal-3.6.2.tar.gz
cd gdal-3.6.2
mkdir build && cd build
cmake .. \
  -DCMAKE_INSTALL_PREFIX=$HOME/opt/gdal \
  -DGDAL_SET_INSTALL_RELATIVE_RPATH=ON \
  -DPROJ_INCLUDE_DIR=$HOME/opt/proj/include \
  -DPROJ_LIBRARY_RELEASE=$HOME/opt/proj/lib64/libproj.so \
  -DGEOS_INCLUDE_DIR=$HOME/opt/geos/build/include \
  -DGEOS_LIBRARY=$HOME/opt/geos/build/lib64/libgeos_c.so \
  -DGDAL_USE_POSTGRESQL=ON
```

## Adapt environment variables

I needed to change the `LD_LIBRARY_PATH` environment variable so that it picks up _Proj_'s lib files. Just make a couple of adjustments to your `.bash_profile`.

`vi ~/.bash_profile`

```
PROJ_DATA=/home/chringel/opt/proj/lib64/
export PROJ_DATA

LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$PROJ_DATA
export LD_LIBRARY_PATH
```

`source ~/.bash_profile`

## Test

```shell
opt/gdal/bin/gdalinfo --version
GDAL 3.6.2, released 2023/01/02 (debug build)
```

## Cleanup

That was a lot of source files. Time to remove them!

```shell
rm -rf ~/geos ~/proj ~/gdal
```
