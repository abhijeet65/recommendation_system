import beautiful_soup_wrapper as BSWrapper
import pySQL
import urllib.request



#web scraper part
url = "https://www.imdb.com/chart/top"
parser = BSWrapper.Parser(url, env = "development")
parser.extract()
movies = parser.search('table', {'class' : ['chart',  'full-width']})
tbody = parser.searchChild(movies, "tbody", {'class' : ['lister-list']})
tr_s = parser.searchChildren(tbody, "tr", {})

movies = []

for tr in tr_s:
    titleColumn = parser.searchChild(tr, "td", {'class' : ['titleColumn']})
    target1 = parser.searchChild(titleColumn, "a", {})
    posterColumn = parser.searchChild(tr, "td", {'class' : ['posterColumn']})
    target2 = parser.searchChild(posterColumn, "a", {})
    imgsrc = parser.searchChild(target2, "img", {})

    # print("processed")
    # print("movie name ", target.text , "movie title" + target['title'])
    # print("------------end------------------")
    movies.append({
        'title' : target1.text,
        'cast' : target1['title'],
        'imgSrc' : imgsrc['src'].split('/')[-1]
    })
    #also, store the image in the public/images directory
    path = "../public/images/"
    print(imgsrc['src'].split('/')[-1])
    path += imgsrc['src'].split('/')[-1]
    urllib.request.urlretrieve(imgsrc['src'], path)



#write to sql table
pySQLObj = pySQL.pySQL()
pySQLObj.connect({
    'host' : "localhost",
    'user' : "root",
    "password" : "",
    "database" : "recommender_system"
})
pySQLObj.from_dicts(movies, "movies")
pySQLObj.commit_and_close()
