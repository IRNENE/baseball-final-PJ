import express from 'express';
const router = express.Router();
import db from '##/configs/mysql.js';

router.get('/', async (req, res) => {
  const userId = req.params.userId;

  // 使用參數化查詢來防止SQL注入
  const sql = 'SELECT * FROM shopping_cart';

  try {
    // 執行參數化查詢，將 `userId` 傳遞作為參數
    const [result] = await db.query(sql, [userId]);

    // 如果結果集為空，則返回404狀態碼和消息
    if (result.length === 0) {
      res.status(404).json({ message: 'No shopping cart items found for the specified user.' });
    } else {
      // 返回整個結果集
      res.json(result);
    }
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ message: 'Error querying database', error });
  }
});


router.post('/course', async (req, res) => {
  const { user_id, product_id, price, amount, start_time, end_time, img } = req.body;
  console.log(req.body)
  // 数据验证（确保所有字段不为空）
  if (!user_id || !product_id || !price || !amount || !img) {
    return res.status(400).json({ status: 'fail', error: 'Missing required fields' });
  }

  // 执行插入数据库操作
  
  try{
    const checkQuery = 'SELECT * FROM cart WHERE user_id = ? AND course_id = ?';
    const [existingRecord] = await db.query(checkQuery, [user_id, product_id]);

    // 如果记录存在
    if (existingRecord.length > 0) {
        // 计算更新后的数量
        const updatedAmount = existingRecord[0].c_amount + amount;
        
        // 更新购物车中的记录
        const updateQuery = 'UPDATE cart SET c_amount = ? WHERE user_id = ? AND course_id = ?';
        await db.query(updateQuery, [updatedAmount, user_id, product_id]);
        
        // 返回成功更新的响应
        res.json({ status: 'update', message: 'Updated shopping cart successfully' })
  }else {
    // 如果记录不存在，则执行插入操作
    const insertQuery = 'INSERT INTO cart (user_id, course_id, c_price, c_amount, start_time, end_time, img) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await db.query(insertQuery, [user_id, product_id, price, amount, start_time, end_time, img]);

    res.json({ status: 'success', message: 'Added to shopping cart successfully' });
  }
}
 catch (err) {
    console.error('Failed to add to shopping cart:', err);
    res.status(500).json({ status: 'fail', error: 'Failed to add to shopping cart' });
  }
});

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  // 使用參數化查詢來防止SQL注入
  const sql = 'SELECT * FROM cart WHERE user_id = ?';

  try {
    // 執行參數化查詢，將 `userId` 傳遞作為參數
    const [result] = await db.query(sql, [userId]);

    // 如果結果集為空，則返回404狀態碼和消息
    if (result.length === 0) {
      res.status(404).json({ message: 'No shopping cart items found for the specified user.' });
    } else {
      // 返回整個結果集
      res.json(result);
    }
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ message: 'Error querying database', error });
  }
});

export default router;
