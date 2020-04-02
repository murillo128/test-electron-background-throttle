function loopAnimationFrames () {
  let start = Date.now()
  requestAnimationFrame(function () {
    let delta = Date.now() - start
    if (delta > 33) {
        console.error('Time since last animation frame exceeds 33ms:', delta);
        document.body.innerHTML += '<div>Time since last animation frame exceeds 33ms:' + delta + '<div>';
    }
    loopAnimationFrames()
  })
}

loopAnimationFrames()
