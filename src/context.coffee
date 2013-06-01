dref = require("dref")

class Context 

  ###
  ###

  constructor: (@_data = {}, @_parent = null) ->

  ###
  ###

  get: (key) -> @_get(key) ? @_parent?.get(key)

  ###
  ###

  _get: (key) -> dref.get(@_data, key)

  ###
  ###

  set: (key, value) -> 
    if arguments.length is 1
      obj = key
      for k of obj
        @_set k, obj[k]
      return

    @_set key, value

  ###
  ###

  _set: (key, value) ->
    scope = @scope(key)

    if scope is @
      dref.set(@_data, key, value)
    else
      scope.set(key, value)

  ###
  ###

  scope: (key) -> 
    p = @
    p = p._parent while p and not p._get(key)
    p or @

  ###
  ###

  root: () -> 
    p = @
    p = p._parent while p._parent

  ###
  ###

  child: (data) -> new Context data, @


module.exports = Context

