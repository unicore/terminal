
async function lazyFetch(api, code, scope, table, lower_bound, upper_bound, limit, index_position, key_type){
    if (!limit) limit = 10
    if (!lower_bound) lower_bound = 0
  

    var data = await api.getTableRows(
         code,
         scope,
         table,
         null,
         lower_bound,
         upper_bound,
         limit,
         key_type,
         index_position
      )

    var result = data.rows
    
    if (data.more == true && limit != 1) {
      
      var redata = await lazyFetch(api, code, scope, table, data.next_key, upper_bound, limit, index_position, key_type)
      result = [...result, ...redata]
      return result
    
    } else {
    
      return result
      
    }
}

export {lazyFetch}