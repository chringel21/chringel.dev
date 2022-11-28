{{- $imageUrl := "" -}}
{{- $author := "" -}}
{{- $authorUrl := "" -}}
{{- $altDescription := "" -}}

{{- $unsplashAccessToken := getenv "HUGO_UNSPLASH_ACCESS_TOKEN" -}}
{{- $authorization := $unsplashAccessToken | printf "%s %s" "Client-ID" -}}
{{- $data := getJSON "https://api.unsplash.com/photos/random/?query=thoughts&orientation=landscape" (dict "Authorization" $authorization) -}}

{{- with $data.urls -}}
  {{- $imageUrl = .regular -}}
{{- end -}}
{{- with $data.user -}}
  {{- $author = .name -}}
  {{- $authorUrl = .links.html -}}
{{- end -}}
{{- with $data.alt_description -}}
  {{ $altDescription = . | humanize}}
{{- end -}}
---
title: "{{ replace .Name "-" " " | title }}"
author: Christian Engel
type: post
date:  {{ .Date }}
cover:
  src: {{ $imageUrl }}
  caption: "{{ $altDescription }} (Photo by [{{ $author }}]({{ $authorUrl }}?utm_source=chringel.dev%20blog&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=chringel.dev%20blog&utm_medium=referral))"
draft: true
categories:
  - A
  - B
  - C
tags:
  - Hugo
  - Game Development
  - Internet of Things (IoT)
  - Linux
  - ...
description: xxx
---

CONTENT

&nbsp;

Source: xyz
