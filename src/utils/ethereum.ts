// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
const truncateEthAddress = (address: `0x${string}` | undefined) => {
  if (address) {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  }
};

/**
 * Calculate total gas for London eth upgrade
 * @param fee base fee in eth
 * @param units gas limit (standard gas limit 21000 - set to default)
 *
 * @returns total gas price in eth rounded to 8 decimal points
 * units of gas used * (base fee + priority fee) - priority fee ignored
 */
const getGasPrice = (fee: string, units: number = 21000): string => {
  return (units * parseFloat(fee)).toFixed(8);
};

export { truncateEthAddress, getGasPrice };
