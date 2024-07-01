import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'

router.get('/', async (req, res) => {
  try {
    // 接收查询参数
    const { priceMin, priceMax, startDate, endDate, type, search, sortOption } =
      req.query

    // 构建 SQL 查询
    let sql = `SELECT course.*, teacher.name AS teacher_name,
          REPLACE(course.description, '\\n', '<br>') AS formatted_description
          FROM course
          JOIN teacher ON course.teacher_id = teacher.id
          WHERE 1=1` // 默认查询条件（即无条件）

    // 根据查询参数添加条件
    if (priceMin && !priceMax) {
      sql += ` AND price>=${priceMin}`
    }
    if (priceMax && priceMin === 0) {
      sql += ` AND price<=${priceMax}`
    }
    // 最小與最大都有輸入的話，查詢範圍
    if (priceMin && priceMax) {
      sql += ` AND price BETWEEN ${priceMin} AND ${priceMax}`
    }
    if (startDate && endDate === 'null') {
      sql += ` AND DATE(course.course_start) <= DATE('${startDate}') AND DATE(course.course_end) >= DATE('${startDate}')`
    } else if (startDate && endDate) {
      sql += ` AND DATE(course.course_start) <= DATE('${startDate}') AND DATE(course.course_end) >= DATE('${endDate}')`
    }
    if (type && type !== '所有') {
      const types = db.escape(`%${type}%`)
      sql += ` AND course.type LIKE ${types}`
    }
    if (search) {
      const encodedKeyword = db.escape(`%${search}%`)
      sql += ` AND course.name LIKE ${encodedKeyword}`
    }

    if (sortOption) {
      switch (sortOption) {
        case '0':
          sql += ` ORDER BY course.id ASC `
          break
        case '1': // 价格排序：高至低
          sql += ` ORDER BY course.price DESC`
          break
        case '2': // 价格排序：低至高
          sql += ` ORDER BY course.price ASC`
          break
        case '3': // 按照课程创建时间从新到旧排序
          sql += ` ORDER BY course.created_at DESC`
          break
        case '4': // 按照课程创建时间从旧到新排序
          sql += ` ORDER BY course.created_at ASC`
          break
        // 其他排序选项可以在这里添加
      }
    }

    // console.log('Generated SQL query:', sql);
    // 执行查询
    const result = await db.query(sql, [
      priceMin,
      priceMax,
      startDate,
      endDate,
      type,
      search,
    ])

    // 返回结果
    res.send(result[0])
  } catch (error) {
    console.error('Error fetching course data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/type', async (req, res) => {
  const sql = `SELECT * FROM type`

  const result = await db.query(sql)
  // console.log(result)
  res.send(result[0])
})

router.get('/:Id', async (req, res) => {
  const id = req.params.Id
  const sql = `SELECT course.*, teacher.name AS teacher_name, teacher.description AS teacher_description
    ,teacher.photo teacher_photo FROM course
    JOIN teacher ON course.teacher_id = teacher.id
    WHERE course.id = ${id}`
    
    try {
      const result = await db.query(sql)
      res.send(result[0])
    } catch (error) {
      console.error('Error querying database:', error)
      res.status(500).send('Error querying database')
    }
  })

  router.get('/by-type/:type', async (req, res) => {
    const type = decodeURIComponent(req.params.type);
    
    // 使用参数化查询，使用占位符 `?` 来防止 SQL 注入
    const sql = `
        SELECT course.*, teacher.name AS teacher_name, teacher.description AS teacher_description, teacher.photo AS teacher_photo
        FROM course
        JOIN teacher ON course.teacher_id = teacher.id
        WHERE course.type = ?
        ORDER BY RAND()
        LIMIT 4;
    `;

    try {
        // 将 type 参数作为数组传递
        const [result] = await db.query(sql, [type]);

        // 如果查询结果不为空，则返回结果
        if (result && result.length > 0) {
            res.json(result);
        } else {
            // 如果查询结果为空，则返回 HTTP 404 状态码
            res.status(404).send('No courses found for the given type');
        }
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).send('Error querying database');
    }
});


// router.get('/:id', (req, res) => {
//   const courseId = req.params.id
//   db.query('SELECT * FROM course WHERE id = ?', [courseId], (error, results) => {
//     if (error) {
//       console.error('Error querying database: ' + error.stack);
//       res.status(500).send('Error querying database');
//       return;
//     }
//     if (results.length === 0) {
//       res.status(404).send('Course not found');
//       return;
//     }
//     res.json(results[0]);
//   });
// });

export default router
