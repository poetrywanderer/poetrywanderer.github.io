(function () {
  'use strict';
  var demos = document.querySelectorAll('[data-world-demo]');
  Array.prototype.forEach.call(demos, function (demo) {
    var video = demo.querySelector('[data-demo-video]');
    var view = demo.querySelector('[data-demo-view]');
    var status = demo.querySelector('[data-demo-status]');
    var buttons = demo.querySelectorAll('[data-demo-seek]');
    var pendingTime = null;
    var resumeAfterLoad = false;

    function selectStage(button) {
      Array.prototype.forEach.call(buttons, function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
    }

    video.addEventListener('loadedmetadata', function () {
      if (pendingTime !== null) {
        video.currentTime = Math.min(pendingTime, Math.max(0, video.duration - 0.03));
        pendingTime = null;
      }
      if (resumeAfterLoad) {
        resumeAfterLoad = false;
        video.play().catch(function () { /* Native controls remain available. */ });
      }
    });

    view.addEventListener('change', function () {
      var mode = view.value;
      pendingTime = video.readyState ? video.currentTime : (pendingTime || 0);
      resumeAfterLoad = !video.paused;
      video.pause();
      demo.setAttribute('data-view', mode);
      video.poster = video.getAttribute('data-poster-' + mode);
      video.src = video.getAttribute('data-' + mode);
      video.load();
      status.textContent = '已切换到' + view.options[view.selectedIndex].text + '，保留当前视频时间。';
    });

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        var seconds = Number(button.getAttribute('data-demo-seek'));
        video.pause();
        resumeAfterLoad = false;
        if (video.readyState >= 1) video.currentTime = seconds;
        else {
          pendingTime = seconds;
          video.preload = 'auto';
          video.load();
        }
        selectStage(button);
        status.textContent = button.querySelector('strong').textContent + '：视频 ' + seconds.toFixed(2) + ' 秒。使用播放按钮继续观看。';
      });
    });

    video.addEventListener('play', function () { selectStage(null); });
    video.addEventListener('error', function () {
      status.textContent = '视频加载失败，可以使用下方 MP4 链接查看，或切换其他视图。';
    });
  });
}());
