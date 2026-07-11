// Health Check Controller
export function getHealth(req, res) {
  res.status(200).json({
    success: true,
    message: 'IQT Smart Task Manager API Is Running',
  });
}
