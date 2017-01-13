function doFirst( callback ){
  setTimeout( function(){
    console.log( 'doFirst: doFirst takes longer than `doSecond`' );
    // if callback exist execute it
    callback();
  }, 3000 );
}

function doSecond(){
  console.log( 'doSecond: but now we can make sure `doSecond` comes out after `doFirst`' );
}

doFirst(
    function(){
        doSecond();
    }
    );
