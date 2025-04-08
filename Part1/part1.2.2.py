import os
import pandas as pd

columns = ['timestamp', 'value']
df = pd.DataFrame(columns=columns)
output_folder = 'divid_files'
os.makedirs(output_folder, exist_ok=True)
dates = pd.date_range(start='2025-06-01', end='2025-06-30', freq='D')
for date in dates:
    filename = date.strftime('%Y-%m-%d') + '.xlsx'
    file_path = os.path.join(output_folder, filename)
    df.to_excel( file_path,index=False)
chunk_size=10000
file_name='time_series.xlsx'
i = 1
while True:
    print(i)
    df = pd.read_excel(file_name, skiprows=i, header=None, nrows=chunk_size)
    if df.empty:
        break
    df.columns = columns
    df['date'] = df['timestamp'].dt.date

    grouped = df.groupby('date')

    for date, group in grouped:
        filename = date.strftime('%Y-%m-%d') + '.xlsx'
        file_path = os.path.join(output_folder, filename)


        df_existing = pd.read_excel(file_path)
        if df_existing.empty:
            pd.DataFrame(group).to_excel(file_path, index=False)
        else:
            df_combined_existing_row = pd.concat([df_existing, pd.DataFrame(group)], ignore_index=True)
            df_combined_existing_row.to_excel(file_path, index=False)
    i += chunk_size
result_all_files=[]
for date in dates:
    result=[]
    filename = date.strftime('%Y-%m-%d') + '.xlsx'
    file_path = os.path.join(output_folder, filename)
    df = pd.read_excel( file_path)
    df.drop_duplicates(inplace=True, subset=['timestamp'], keep=False)
    df = df[df['value'].apply(lambda x: isinstance(x, (int, float)) and not pd.isna(x))]
    df.sort_values(by='timestamp', inplace=True)
    start_value =  df.iloc[0, 0].floor('h')
    value = 0
    count = 0
    for index, row in df.iterrows():
        if row['timestamp'] < start_value + pd.Timedelta(hours=1):
            value += row['value']
            count += 1
        else:
            average_value = value / count
            result.append([start_value,average_value])
            start_value = start_value + pd.Timedelta(hours=1)
            value = row['value']
            count = 1
    if count > 0:
        average_value = value / count
        result.append([start_value,average_value])
    result_all_files.extend(result)
df = pd.DataFrame( result_all_files, columns=['Start_Time', 'Average'])
df.to_excel("output_average_value1.2.2.xlsx", index=False)
