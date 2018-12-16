import mysql.connector

class pySQL:
    '''this module converts any python object to an sql file. for example if you have a list of rows that you got 
        from some resource e.g (from sensors, or from the internet via scraping), the data is huge and massive. In such cases,
        it is virtually impossible to write insert commands to populate the sql database.'''
    def connect(self, connectionObject):
        self.db = mysql.connector.connect(host=connectionObject['host'], user=connectionObject['user'], password=connectionObject['password'], database=connectionObject['database'])
        self.cursor = self.db.cursor()
        print("connection details", self.db)
    def from_dicts(self, dicts, tableName):
        print(dicts)
        for dictObject in dicts:
            print(dictObject)
            queryString = "INSERT INTO " + tableName + "("
            valueString = ""
            pos = 0
            for key in dictObject.keys():
                queryString += (", " if pos != 0 else "") + str(key) 
                valueString += (", " if pos != 0 else "") + '"' + str(dictObject[key]) + '"' 
                pos = pos + 1
            queryString += ") VALUES(" + valueString + ")"
            # print("the query is " + queryString)
            self.cursor.execute(queryString)
    def commit_and_close(self):
        self.db.commit()
        self.db.close()