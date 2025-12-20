// Helper function to serialize BigInt values
export const serializeBigInt = (data: any) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )