#!/bin/bash

sort sitemaps/profiles/50000.txt | uniq > sitemaps/profiles/temp.txt
rm sitemaps/profiles/50000.txt
mv sitemaps/profiles/temp.txt sitemaps/profiles/50000.txt
