---
title: "Export Large Geojson From Oracle"
author: Christian Engel
type: post
date:  2022-04-07
featured_image: images/blog/2022/export-large-geojson-from-oracle.png
categories:
  - Coding
  - Tutorials
tags:
  - Oracle Database
  - Oracle Spatial
  - SQL Developer
  - Geojson
  - Export
  - Blob
  - PostgreSQL
  - PostGIS
  - Import
  - jsonlint
  - ogr2ogr
  - ogrinfo
  - sed
description: How to export large Geojson objects from a Oracle Spatial database for importing to PostgreSQL/PostGIS
---

Recently I found myself in a tricky situation: I was tasked to export spatial data from an Oracle database for importing into PostgreSQL with PostGIS extentsion.

You might think *"Easy, just use a command line tool like `ogr2ogr`"*. But here's the catch: There was no direct connection between the two database systems. It was even more complicated, because I had to use a Remote Desktop connection to access the Oracle database via SQL Developer, but that's not the point of this post.

**So what do you do, if you have to move large amounts of spatial data between two isolated systems?**

## Geojson to the rescue 🦸

[Geojson](https://geojson.org/) can be used as an exchange format between databases. Oracle 12.2 introduced the function `get_geojson()` for spatial data types like `SDO_GEOMETRY`. This will produce **geojson features**. Suppose the spatial data lies in a column called `SHAPE`, we can do:

```sql
SELECT 
  c.SHAPE.get_geojson() AS JSON
FROM MY_TABLE c
-------------------------------
-- { "type": "Point", "coordinates": [6.768617, 51.195687] }
-- { "type": "Point", "coordinates": [6.73752, 51.241592] }
-- { "type": "Point", "coordinates": [6.775968, 51.326056] }
-------------------------------
```

But what about the properties? Geojson does not only hold **geometries**, but also **attributes**. No problem either. We can construct a geojson feature with properties.

```sql
SELECT
  json_object(
    'type' VALUE 'Feature',
    'properties' VALUE json_object(
      'column_1' VALUE COLUMN_1,
      'column_2' VALUE COLUMN_2,
      ...
      'column_n' VALUE COLUMN_N
    ),
    'geometry' VALUE c.SHAPE.get_geojson() FORMAT json
  )
FROM MY_TABLE c
-------------------------------
-- { 
--    "type": "Feature", 
--    "properties": { "column_1": "value", "column_2": "value", ... , "column_n" : "value" },
--    "geometry": { "type": "Point", "coordinates": [6.768617, 51.195687] }
-- }
-- ...
-------------------------------
```

OK. Simple enough. **Points** with only single pairs of coordinates are no problem. But what about more complex geometries, like **MultiLines**, **Polygons** or even **MultiPolygons** with hundreds or even thousands of waypoints. Depending on the level of detail of your geometries, they might get cut off or Oracle will throw an error, saying it can't display more than 4000 characters. Insert `CLOB`.

## CLOB can handle it all 💪

`LOB`s (large object) are special database data types. `BLOB`s are usually meant for storing **binary data**, like images or PDF files. But there is also `CLOB` to output large amounts of text, or in our case, massively complex geometries. With the help of the `json_object()` function's **returning** clause, the geometry column will be output as a `CLOB` type.

```sql
SELECT
  json_object(
    'type' VALUE 'Feature',
    'properties' VALUE json_object(
      'column_1' VALUE COLUMN_1,
      'column_2' VALUE COLUMN_2,
      ...
      'column_n' VALUE COLUMN_N
    ),
    'geometry' VALUE c.SHAPE.get_geojson() FORMAT json returning CLOB
  )
FROM MY_TABLE c
```

That's it. Now all rows of our table will have their full geometry.

## Exporting the data 📩

Unfortunately, exporting the data at this stage to a text based format like JSON or CSV will, again, cut off the geometry column at 4000 characters. But we can use the `loader` format for exporting. Right click on one of the preview rows and select **Export Objects**.

!["Export data using loader format"](images/export_loader_format.png "Export options. Image by [Jeff Smith](https://www.thatjeffsmith.com/archive/2014/05/exporting-multiple-blobs-with-oracle-sql-developer/)")

Note the second box:

* Select **Save As: Seperate Files**
* Tick **Compressed**

Unzip the archive on your target machine (with a connection to the PostgreSQL database). Now you'll have some data cleanup to do.

## Cleanup the data 🧼

Move to the folder where you extracted the archive. We are intereseted in all files ending in `*.ldr`. From now on, we will be working with a couple of temporary files, but bear with me - we're getting there.

1. Concat all `*.ldr` files into a single file. This will append feature after feature to a single line.

```shell
cat *.ldr > tmp1.json
```

2. Create a `FeatureCollection`. Add a newline character (`\n`) after each feature and wrap it with curly braces and the `"FeatureCollection"` property.

```shell
# Replace closing, opening curly braces with closing curly brace, comma, newline, opening curly brace
sed "s/}{/},\n{/g" tmp1.json > tmp2.json

# Add FeatureCollection surroundings
{ echo "{\"type\":\"FeatureCollection\",\"features\":["; cat tmp2.json; echo "]}" } > featurecollection.json
```

3. If your source table's geometry column only contains a single geometry type, you're done. Congratulations! Test if your JSON file is valid.

```shell
jsonlint featurecollection.json
ogrinfo featurecollection.json
```

4. **(Optional)** If, as it was the case for me, you are dealing with different geometry types (Oracle can hold different geometry types in a single column 🤯), there is more to do. My target tables's geometry data type was `MULTIPOLYGON`, so I had to convert all `POLYGON`s to `MULTIPOLYGON`s (which is possible, because Polygons are just MultiPolygons with a single ring).

```shell
cp featurecollection.json tmp3.json

# Replace POYLGON feature type with MULTIPOLYGON feature type
sed "s/\"Polygon\", \"coordinates\": \[ \[ \[/\"MultiPolygon\", \"coordinates\": \[ \[ \[ \[/g" tmp3.json > tmp4.json

# Replace POLYGONs 3 squared brackets with MULTIPOLYGONs 4 squared brackets
sed "s/\([0-9]\)\] \] \] }}/\1\] \] \] \]}}/g" tmp4.json > featurecollection.json
```

## Importing to PostgreSQL/PostGIS 📥

Create the target table with columns according to your needs. After that, it's a simple one liner. Replace `my_db`, `my_user`, `my_password`, `localhost` and `taget_db` with values from your setup.

```shell
ogr2ogr -f "PostgreSQL" PG:"dbname=my_db user=my_user password=my_password host=localhost" "featurecollection.json" -nln target_db -append
```

---

Image: [Ludriff](https://commons.wikimedia.org/w/index.php?title=User:Ludriff&action=edit&redlink=1) on [https://commons.wikimedia.org](https://commons.wikimedia.org/wiki/File:Sql_developer_main_window.png)

Sources:

* https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/JSON_OBJECT.html#GUID-1EF347AE-7FDA-4B41-AFE0-DD5A49E8B370
* https://www.thatjeffsmith.com/archive/2014/05/exporting-multiple-blobs-with-oracle-sql-developer/
* [Using_GeoJSON_in_Oracle_Database](https://download.oracle.com/otndocs/products/spatial/pdf/biwa2018/BIWA18_Using_GeoJSON_in_Oracle_Database.pdf)