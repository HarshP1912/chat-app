def FindKey(input1, input2, input3):
    # Helper function to find the largest and smallest digits in a number
    def find_largest_and_smallest_digit(number):
        digits = [int(d) for d in str(number)]
        largest = max(digits)
        smallest = min(digits)
        return largest, smallest

    # Find largest and smallest digits for each input
    largest1, smallest1 = find_largest_and_smallest_digit(input1)
    largest2, smallest2 = find_largest_and_smallest_digit(input2)
    largest3, smallest3 = find_largest_and_smallest_digit(input3)

    # Calculate the sums
    sum_largest = largest1 + largest2 + largest3
    sum_smallest = smallest1 + smallest2 + smallest3

    # Calculate the Key
    Key = sum_largest - sum_smallest

    return Key


# Example usage:
input1 = 3521
input2 = 2452
input3 = 1352

key = FindKey(input1, input2, input3)
print("The Key is:", key)  # Output should be 11
