# Fake database for now 
def get_db(): 
    class FakeDB: 
        def query(self, *args): return [] 
        def filter(self, *args): return self 
        def first(self): return None 
    yield FakeDB() 
