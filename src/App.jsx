import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Slider, 
  Typography, 
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Alert,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CompareIcon from '@mui/icons-material/Compare';
import HomeIcon from '@mui/icons-material/Home';
import './App.css';

// 导入组件
import Home from './components/Home';
import ImageResizer from './components/ImageResizer';

// 自定义上传按钮样式
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ImagePreview = styled(CardMedia)({
  height: 0,
  paddingTop: '75%', // 4:3 宽高比
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f7',
});

// 图片压缩组件
function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressValue, setCompressValue] = useState(80); // 默认压缩质量为80%
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理图片上传
  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    // 检查文件类型
    if (!imageFile.type.match('image/jpeg') && !imageFile.type.match('image/png')) {
      setError('只支持 JPEG 和 PNG 格式的图片');
      return;
    }

    setError('');
    setOriginalImage({
      file: imageFile,
      url: URL.createObjectURL(imageFile),
      size: imageFile.size,
    });

    // 上传后自动压缩
    await compressImage(imageFile);
  };

  // 处理压缩比例变化
  const handleCompressValueChange = (event, newValue) => {
    setCompressValue(newValue);
  };

  // 应用压缩
  const handleApplyCompression = async () => {
    if (!originalImage) return;
    await compressImage(originalImage.file);
  };

  // 压缩图片
  const compressImage = async (imageFile) => {
    try {
      setLoading(true);
      
      const options = {
        maxSizeMB: 1, // 最大文件大小
        maxWidthOrHeight: 1920, // 最大宽度或高度
        useWebWorker: true,
        initialQuality: compressValue / 100, // 压缩质量
      };

      const compressedFile = await imageCompression(imageFile, options);
      
      setCompressedImage({
        file: compressedFile,
        url: URL.createObjectURL(compressedFile),
        size: compressedFile.size,
      });
    } catch (error) {
      console.error('压缩图片时出错:', error);
      setError('压缩图片时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 下载压缩后的图片
  const handleDownload = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage.url;
    link.download = `compressed_${originalImage.file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 计算压缩率
  const compressionRate = () => {
    if (!originalImage || !compressedImage) return 0;
    return ((1 - compressedImage.size / originalImage.size) * 100).toFixed(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1d1d1f' }}>
          图片压缩工具
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          上传您的图片，调整压缩比例，获取更小的文件大小而不明显损失质量
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3, 
          backgroundColor: '#f5f5f7',
          border: '1px solid #e0e0e0'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 3,
                  backgroundColor: '#0071e3',
                  '&:hover': {
                    backgroundColor: '#0077ed',
                  },
                }}
              >
                选择图片
                <VisuallyHiddenInput type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} />
              </Button>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                支持 JPEG 和 PNG 格式
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography gutterBottom>压缩质量: {compressValue}%</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={compressValue}
                    onChange={handleCompressValueChange}
                    aria-labelledby="compression-slider"
                    valueLabelDisplay="auto"
                    min={10}
                    max={100}
                    sx={{
                      color: '#0071e3',
                      '& .MuiSlider-thumb': {
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0px 0px 0px 8px rgba(0, 113, 227, 0.16)',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={handleApplyCompression}
                    disabled={!originalImage || loading}
                    startIcon={<CompareIcon />}
                    sx={{
                      borderRadius: 2,
                      borderColor: '#0071e3',
                      color: '#0071e3',
                      '&:hover': {
                        borderColor: '#0077ed',
                        backgroundColor: 'rgba(0, 113, 227, 0.04)',
                      },
                    }}
                  >
                    应用
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#0071e3' }} />
        </Box>
      )}

      {originalImage && compressedImage && !loading && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ImageCard>
                <ImagePreview
                  image={originalImage.url}
                  title="原始图片"
                  sx={{ backgroundImage: `url(${originalImage.url})` }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>原始图片</Typography>
                  <Typography variant="body2" color="text.secondary">
                    文件大小: {formatFileSize(originalImage.size)}
                  </Typography>
                </CardContent>
              </ImageCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageCard>
                <ImagePreview
                  image={compressedImage.url}
                  title="压缩后图片"
                  sx={{ backgroundImage: `url(${compressedImage.url})` }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>压缩后图片</Typography>
                  <Typography variant="body2" color="text.secondary">
                    文件大小: {formatFileSize(compressedImage.size)}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 500, mt: 1 }}>
                    压缩率: {compressionRate()}%
                  </Typography>
                </CardContent>
              </ImageCard>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                backgroundColor: '#0071e3',
                '&:hover': {
                  backgroundColor: '#0077ed',
                },
              }}
            >
              下载压缩后的图片
            </Button>
          </Box>
        </>
      )}

      <Box sx={{ mt: 8, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} 图片压缩工具 | 保护您的隐私，所有处理均在浏览器中完成
        </Typography>
      </Box>
    </Container>
  );
}

// 主应用组件
function App() {
  const [currentTool, setCurrentTool] = useState('home');
  
  // 导航到指定工具
  const navigateTo = (toolId) => {
    setCurrentTool(toolId);
  };
  
  // 返回首页
  const goHome = () => {
    setCurrentTool('home');
  };
  
  // 渲染当前工具
  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'compress':
        return <ImageCompressor />;
      case 'resize':
        return <ImageResizer />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {currentTool !== 'home' && (
        <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="primary"
              aria-label="home"
              onClick={goHome}
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1d1d1f' }}>
              图片工具箱
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      {renderCurrentTool()}
    </Box>
  );
}

export default App;