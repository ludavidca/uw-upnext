from pymongo import MongoClient
from typing import Optional, Dict, List

def copy_collection(
    source_collection_name: str,
    target_collection_name: str,
    db_name: str,
    connection_string: str = "mongodb://localhost:27017/",
    query_filter: Optional[Dict] = None,
    indexes: bool = True
) -> int:

    # Connect to MongoDB
    client = MongoClient(connection_string)
    db = client[db_name]
    
    # Get source and target collections
    source = db[source_collection_name]
    target = db[target_collection_name]
    
    # Copy documents
    docs_to_copy = source.find(query_filter) if query_filter else source.find()
    
    # Insert documents in batches for better performance
    batch_size = 1000
    batch: List = []
    copied_count = 0
    
    for doc in docs_to_copy:
        batch.append(doc)
        if len(batch) >= batch_size:
            target.insert_many(batch)
            copied_count += len(batch)
            batch = []
    
    # Insert remaining documents
    if batch:
        target.insert_many(batch)
        copied_count += len(batch)
    
    # Copy indexes if requested
    if indexes:
        index_info = source.index_information()
        # Skip the _id_ index as it's created automatically
        for index_name, index_info in index_info.items():
            if index_name != '_id_':
                keys = index_info['key']
                # Convert index information to kwargs
                index_kwargs = {
                    k: v for k, v in index_info.items() 
                    if k not in ['ns', 'v', 'key']
                }
                target.create_index(keys, **index_kwargs)
    
    client.close()
    return copied_count

# Example usage with different scenarios
if __name__ == "__main__":
    # Basic copy of entire collection
    docs_copied = copy_collection(
        source_collection_name="old_collection",
        target_collection_name="new_collection",
        db_name="your_database"
    )
    print(f"Copied {docs_copied} documents")
    
    # Copy with a filter
    filter_query = {"status": "active", "age": {"$gt": 25}}
    docs_copied = copy_collection(
        source_collection_name="users",
        target_collection_name="active_adult_users",
        db_name="your_database",
        query_filter=filter_query
    )
    print(f"Copied {docs_copied} filtered documents")
    
    # Copy to different database (using connection string)
    docs_copied = copy_collection(
        source_collection_name="products",
        target_collection_name="products_backup",
        db_name="store",
        connection_string="mongodb://user:pass@remote-host:27017/"
    )
    print(f"Copied {docs_copied} documents to remote database")