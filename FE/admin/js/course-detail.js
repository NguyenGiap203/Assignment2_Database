// course-detail.js — full sync with new db.js + avg rating calculation
(function ensureAuth() {
  if (!localStorage.getItem("token")) location.href = "../index.html";
})();

function el(id) {
  return document.getElementById(id);
}

function loadCourseDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) return (location.href = "course-list.html");

  const courses = read(DB_KEYS.courses);
  const chapters = read(DB_KEYS.chapters);
  const videos = read(DB_KEYS.videos);
  const exercises = read(DB_KEYS.exercises);
  const practices = read(DB_KEYS.practices);
  const tests = read(DB_KEYS.tests);
  const enrollments = read(DB_KEYS.enrollments);
  const reviews = read(DB_KEYS.reviews);
  const users = read(DB_KEYS.users);

  // course object
  const c = courses.find((x) => x.id === id);
  if (!c) return (location.href = "course-list.html");

  // -----------------------------
  // Fill base info
  // -----------------------------
  el("cd_id").value = c.id;
  el("cd_title").value = c.title;
  el("cd_desc").value = c.description || "";
  el("cd_status").value = c.status || "";
  el("cd_duration").value = (c.totalDuration || 0) + " giờ";

  // -----------------------------
  // Derivative counts
  // -----------------------------
  const chList = chapters.filter((ch) => ch.courseId === c.id);
  const vdList = videos.filter((v) => chList.some((ch) => ch.id === v.chapterId));
  const exList = exercises.filter((ex) => chList.some((ch) => ch.id === ex.chapterId));
  const testList = tests.filter((t) => chList.some((ch) => ch.id === t.chapterId));
  const enrolList = enrollments.filter((e) => e.courseId === c.id);

  el("cd_chapters").value = chList.length;
  el("cd_videos").value = vdList.length;
  el("cd_exercises").value = exList.length;
  // sau khi tính testList
if(el('cd_tests_link')){
  el('cd_tests_link').innerText = testList.length;
  el('cd_tests_link').href = `test-list.html?course=${c.id}`;
}

  el("cd_participants").value = enrolList.length;

  // -----------------------------
  // Compute real-time average rating
  // -----------------------------
  const rv = reviews.filter((r) => r.courseId === c.id);

  const avgRating = rv.length
    ? (rv.reduce((sum, r) => sum + (r.rating || 0), 0) / rv.length).toFixed(1)
    : "0.0";

  el("cd_rating").value = avgRating;

  // -----------------------------
  // Render rating detail list
  // -----------------------------
  if (el("cd_review_body")) {
    el("cd_review_body").innerHTML = rv
      .map((r) => {
        const u = users.find((x) => x.id === r.userId);
        return `
        <tr>
          <td>${r.id}</td>
          <td>${r.rating}</td>
          <td>${r.comment || ""}</td>
          <td><a href="user-detail.html?id=${u?.id}">${u?.username || r.userId}</a></td>
          <td>${r.createdAt}</td>
        </tr>
      `;
      })
      .join("");

    el("cd_review_count").innerText = rv.length;
  }

  // -----------------------------
  // Optional: list of participants
  // -----------------------------
  if (el("cd_user_body")) {
    el("cd_user_body").innerHTML = enrolList
      .map((en) => {
        const u = users.find((x) => x.id === en.userId);
        return `
        <tr>
          <td>${en.id}</td>
          <td><a href="user-detail.html?id=${u?.id}">${u?.username || en.userId}</a></td>
          <td>${en.joinedAt}</td>
          <td>${en.isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}</td>
        </tr>
      `;
      })
      .join("");

    el("cd_user_count").innerText = enrolList.length;
  }
}

window.addEventListener("load", loadCourseDetail);
