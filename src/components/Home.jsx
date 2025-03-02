import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, CardActionArea, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CompressIcon from '@mui/icons-material/Compress';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

const ToolCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#e8f4fc',
  margin: '0 auto 16px',
  '& svg': {
    fontSize: '30px',
    color: '#0071e3',
  },
}));

function Home({ onNavigate }) {
  const tools = [
    {
      id: 'compress',
      title: '图片压缩',
      description: '压缩图片文件大小，保持较好的图片质量',
      icon: <CompressIcon />,
    },
    {
      id: 'resize',
      title: '图片尺寸调整',
      description: '调整图片尺寸，支持自定义宽高和等比缩放',
      icon: <AspectRatioIcon />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1d1d1f' }}>
          图片工具箱
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          简单易用的在线图片处理工具，保护您的隐私，所有处理均在浏览器中完成
        </Typography>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            backgroundColor: '#f5f5f7', 
            display: 'inline-block',
            borderRadius: 3,
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            无需上传到服务器，保护您的隐私安全
          </Typography>
        </Paper>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.id}>
            <ToolCard>
              <CardActionArea 
                sx={{ height: '100%', p: 3 }} 
                onClick={() => onNavigate(tool.id)}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconWrapper>
                    {tool.icon}
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    {tool.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {tool.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </ToolCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} 图片工具箱 | 保护您的隐私，所有处理均在浏览器中完成
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;