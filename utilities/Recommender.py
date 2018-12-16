import numpy as np
import mysql.connector
class Recommender:
    def __init__(self, users, movies, userID):
        self.users = users
        self.movies = movies
        self.userID = userID # this is the user who needs the recommendations
        self.db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="recommender_system"
        )
        self.cursor = self.db.cursor()
    def get_movie_user_matrix(self):
        self.matrix = np.zeros(shape=[self.users + 1, self.movies])
        #here we select the users randomly...
        #get min and max ids of users
        query = 'select id from users'
        self.cursor.execute(query)
        result = self.cursor.fetchall()
        self.user_ids = list(map(lambda x : x[0], result))
        self.user_ids = list(filter(lambda x : x != self.userID, self.user_ids))
        self.user_ids = list(np.random.permutation(self.user_ids))
        self.user_ids = self.user_ids[:self.users]
        #append our userID at the end
        self.user_ids.append(self.userID)
        self.mean_rating = {}

        for i in range(self.users + 1):
            user_id = self.user_ids[i]
            query = 'select movieId, rating from ratings where userId = ' + str(user_id)
            self.cursor.execute(query)
            results = self.cursor.fetchall()

            for result in results:
                self.matrix[i][result[0]] = result[1]
            #print(results)

        row_sum = self.matrix.sum(axis=1)

        #print(self.user_ids)
        #print(self.mean_rating)
        #print(self.matrix[:, 510:])

    def get_similarity(self):
        '''

        :param userA: user ID of a user
        :return: the similarity between user A and other users B in the matrix(pearson correlation)
        for more info : https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
        '''

        #NOTE self.users = len(self.user_ids) - 1
        userA = len(self.user_ids) - 1 # our userID index is at the end of the list
        movieA = self.matrix[userA]
        self.sim = {} # this is a dict which stores <userID, similarity> as key-pairs
        for it in range(self.users):
            userB = it
            user = self.user_ids[it]
            movieB = self.matrix[userB]

            num = 0.0
            den1 = 0.0
            den2 = 0.0
            rated_moviesA = np.array(list(filter(lambda x : x != 0, movieA)))
            rated_moviesB = np.array(list(filter(lambda x : x != 0, movieB)))
            lenA = len(rated_moviesA)
            lenB = len(rated_moviesB)
            #to AVOID division by zero
            if lenA == 0:
                lenA = 1
            if lenB == 0:
                lenB = 1

            mean_ratingA = sum(rated_moviesA) / lenA
            mean_ratingB = sum(rated_moviesA) / lenB
            for i in range(self.movies):
                if movieA[i] != 0 and movieB[i] != 0:
                    #this means both have watched and rated the movie
                    num += (movieA[i] - mean_ratingA) * (movieB[i] - mean_ratingB)
            #print(np.sqrt(np.sum((rated_moviesA - mean_ratingA) ** 2)))
            den1 = np.sqrt(np.sum((rated_moviesA - mean_ratingA) ** 2))
            den2 = np.sqrt(np.sum((rated_moviesA - mean_ratingB) ** 2))
            if den1 == 0 or den2 == 0:
                self.sim[user] = 0
            else:
                self.sim[user] = num / (den1 * den2)
        #print(self.sim)
        return self.sim
    def recommend_movies(self, number_movies):
        '''
        this function recommends a set of movies to the user defined by userID
        :param: number_movies :
        :return: a list of movie IDs corresponding to the movies to be recommended to the user.
        '''
        self.get_movie_user_matrix()
        self.get_similarity()
        #sort the similarities in decreasing order
        sorted_sim = sorted(self.sim.items(), key=lambda kv : kv[1], reverse=True)
        movies_list = []
        for item in sorted_sim:

            user = item[0]
            similarity = item[1]
            if similarity <= 0:
                continue
            ind = self.user_ids.index(user)
            for it in range(self.movies):
                if self.matrix[ind][it] != 0 and self.matrix[len(self.user_ids) - 1][it] == 0:
                    movies_list.append(it)
        #we want a distinct set of movie ids
        movies_list = list(set(movies_list))
        # print(movies_list)
        if number_movies > len(movies_list):
            return movies_list
        else:
            return movies_list[:number_movies]
