from pymongo import MongoClient

connection_string = ""

client = MongoClient(connection_string)

# Source and target databases
source_db_name = "Guardos"
target_db_name = "GuardosProd"
source_db = client[source_db_name]
target_db = client[target_db_name]

# Get the list of collections in the source database
collections = source_db.list_collection_names()

# Copy each collection
for collection_name in collections:
    source_collection = source_db[collection_name]
    target_collection = target_db[collection_name]
    target_collection.drop()

    # Copy documents from source to target collection
    documents = source_collection.find()
    if source_collection.count_documents({}) > 0:
        target_collection.insert_many(documents)

print(f"All collections from {source_db_name} have been copied to {target_db_name}.")