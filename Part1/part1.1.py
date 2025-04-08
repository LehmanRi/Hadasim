import pandas as pd
def find_k_common_error(file_name, k_common, chunk_size=10000):
    dic_error_types={}
    i = 0
    while True:
        df = pd.read_excel(file_name, header=None, skiprows=i, nrows=chunk_size)
        if df.empty:
            break
        for index, row in df.iterrows():
            error_type = row[0].split("Error:")[-1]
            if error_type in dic_error_types.keys():
               dic_error_types[error_type]=dic_error_types[error_type]+1
            else:
               dic_error_types[error_type]=1
        i += chunk_size
    return  [k for k, v in sorted(dic_error_types.items(), key=lambda x: x[1], reverse=True)[:k_common]]

print(find_k_common_error('logs.txt.xlsx', 2)) # Answer [' WARN_101', ' ERR_404']
# Run time complexity:
# Read all lines in first loop is N.
# Sorted is number_of_errors log number_of_errors, number_of_errors <= N.
# k for k, v is k_common.
# Therefore O(NlogN) (the worst case is that number_of_errors equals the number of rows in file).
# Space complexity:
# What is saved in the memory is the chunks and the dictionary.
# Chunks is the size by choice accordingly to the computer ram.
# Dictionary in the worst case is the size of N (the worst case is that number_of_errors equals the number of rows in file).
# Therefore O(N).