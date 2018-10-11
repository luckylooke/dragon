export default function lockAxisPlugin( dragonObject ){
  // console.log( dragonObject ) /* eslint-disable no-console */
  dragonObject.Drag.prototype.start.use( function( next, init_x, init_y ) {
    const conf = this.getConfig('lockAxisPlugin') || {}

    if ( conf.lockX )
      this.drag.use(( next, x, y ) => {
        return next( init_x, y )
      })
    else if ( conf.lockY )
      this.drag.use(( next, x ) => {
        return next( x, init_y )
      })

    return next( init_x, init_y )
  })
}
