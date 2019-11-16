# Helper fucntion: Check if a string is a number
def is_number? (string)
  true if Float(string) rescue false
end

# Initialize the col names array and corresponding values array
columns = [];
values = [];

# Read the csv file, parse the value into array and add them to the values array
file = File.open('phl_hec_all_confirmed.csv');
file.each_line do |line|
  values.push(line.split(","))
end

#Take the first array out values array and add it to the col array
columns.concat(values.shift())

# Initialize idx to for the iterattion
row = 0
col = 0
num_rows = values.length

numeric_cols = [];

# Iterate thrtough the arrays, check if all the values in each col are numeric.
# Add the column names of the numeric ones to numeric_cols
while col < columns.length

  while row < num_rows
    curr_val = values[row][col].gsub(/\s+/, '')
    if curr_val == ""
      row +=1;
      next;
    end
    break unless is_number?(curr_val)
    row +=1;
  end

  if row == num_rows
    numeric_cols.push(columns[col])
  end
  col +=1
  row = 0
end

# Get all the column names from the result printed out
print numeric_cols
