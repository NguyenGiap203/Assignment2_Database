// course.js — compute rating from reviews + sync with c_tbody
(function ensureAuth() {
  if (!localStorage.getItem("token")) location.href = "../index.html";
})();

function el(id) {
  return document.getElementById(id);
}

function renderCourses() {
  const tbody = el("c_tbody");
  if (!tbody) return;

  const courses = read(DB_KEYS.courses);
  const reviews = read(DB_KEYS.reviews);

  const q = (el("c_search")?.value || "").toLowerCase();
  const filterStatus = el("c_status")?.value || "";
  const sortKey = el("c_sort")?.value || "";

  // FILTER
  let list = courses.filter((c) => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  });

  // SORT
  list = list.sort((a, b) => {

    // Thời lượng ↑
    if (sortKey === "duration") {
      return (a.totalDuration || 0) - (b.totalDuration || 0);
    }

    // Đánh giá ↓
    if (sortKey === "rating") {
      const ar = reviews.filter((r) => r.courseId === a.id);
      const br = reviews.filter((r) => r.courseId === b.id);

      const avgA = ar.length
        ? ar.reduce((s, r) => s + (r.rating || 0), 0) / ar.length
        : 0;

      const avgB = br.length
        ? br.reduce((s, r) => s + (r.rating || 0), 0) / br.length
        : 0;

      return avgB - avgA;
    }

    // Người học ↓
    if (sortKey === "participants") {
      return (b.participants || 0) - (a.participants || 0);
    }

    return 0;
  });

  // RENDER
  tbody.innerHTML = list
    .map((c) => {
      const rv = reviews.filter((r) => r.courseId === c.id);
      const avgRating = rv.length
        ? (rv.reduce((sum, r) => sum + (r.rating || 0), 0) / rv.length).toFixed(
            1
          )
        : "0.0";

      return `
      <tr>
        <td>${c.id}</td>
        <td><a href="course-detail.html?id=${c.id}">${c.title}</a></td>
        <td>${c.status}</td>
        <td>${c.totalDuration}h</td>
        <td>${c.numPractices}</td>
        <td>${c.numVideos}</td>
        <td>${c.participants}</td>
        <td>${avgRating}</td>
        <td class="actions">
          <button onclick="editCourse('${c.id}')">Sửa</button>
          <button onclick="deleteCourse('${c.id}')">Xóa</button>
        </td>
      </tr>`;
    })
    .join("");
}

function editCourse(id) {
  location.href = `course-form.html?id=${id}`;
}

function deleteCourse(id) {
  if (!confirm("Xác nhận xóa khóa học " + id + "?")) return;
  let arr = read(DB_KEYS.courses);
  arr = arr.filter((x) => x.id !== id);
  write(DB_KEYS.courses, arr);
  renderCourses();
}

window.addEventListener("load", renderCourses);
