import Recommender
import sys
import json

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

'''
    this is the bridge between nodejs and python
    arguments made by the nodejs backend
    :argv1 : userID
    :argv2 : number of neighboring users needed
    :argv3 : number of movies
    :argv4 : the number of movies required recommended
'''

# args = read_in()
# print(args)
def main():
    # sys.stdout.write("hello hello hello hello")

    recommenderObject = Recommender.Recommender(int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[1]))

    results = recommenderObject.recommend_movies(int(sys.argv[4]))
    for i in range(len(results)):
        print(results[i], end=" ")
    print("")
if __name__ == '__main__':
    main()