#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os, re, requests
from pyquery import PyQuery as pq

def mkDir(path):
	if not os.path.exists(path):
		os.mkdir(path)
	return path

def getMonth(char):
	if char == "Jan":
		return "01"
	elif char == "Feb":
		return "02"
	elif char == "Mar":
		return "03"
	elif char == "Apr":
		return "04"
	elif char == "May":
		return "05"
	elif char == "Jun":
		return "06"
	elif char == "Jul":
		return "07"
	elif char == "Aug":
		return "08"
	elif char == "Sep":
		return "09"
	elif char == "Oct":
		return "10"
	elif char == "Nov":
		return "11"
	elif char == "Dec":
		return "12"
	return char

def getDay(char):
	match = re.compile('\d+').match(char)
	if(match):
		day = (int)(match.group())
		if day < 10:
			return "0%d" % day
		else:
			return day
	return char

def startToDownloadImages(htmlSource):
	d = pq(htmlSource)
	for post in d('.autopagerize_page_element .post'):
		date = d(post).find('.datenotes a:first')
		arr = date.text().split(' ')
		if len(arr) == 3:
			date_str = ("%s-%s-%s" % (arr[2], getMonth(arr[1]), getDay(arr[0])))
			imgs = d(post).find('img')
			for img in imgs:
				href = img.attrib['src']
				# 根据时间建立文件夹
				path = "images/%s" % date_str
				mkDir(path)
				# 开始下载图片
				imgPath = "%s/%s" % (path, href.split('/')[-1])
				if os.path.exists(imgPath):
					# print(u"跳过已存在图片:%s" % imgPath)
					continue
				print(u"开始下载图片:%s" % href)
				try:
					r = requests.get(href, stream = True)
				except Exception, e:
					print e
					continue
				with open(imgPath, 'wb') as f:
					for chunk in r.iter_content(chunk_size = 1024): 
						if chunk:
							f.write(chunk)
							f.flush()		
	# 判断下是否还有下一页
	if d('#next'):
		return True
	return False

def fetch(pageNum, cookies = {}):
	url = "%s" % pageNum
	print(u"开始访问   %s" % url)
	
	headers = {'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36'}
	response = requests.get(url, headers = headers, cookies = cookies)
	if response.status_code == 200:
		return startToDownloadImages(response.text)
	print(u"访问%s错误:%d" % (url, response.status_code))
	return False

if __name__ == '__main__':
	mkDir("images")
	page = 105
	while True:
		if fetch(page):
			page += 1
		else:
			break
	print(u"结束")
