import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

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

function ImageResizer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    if (maintainAspectRatio && aspectRatio && width) {
      const newHeight = Math.round(width / aspectRatio);
      setHeight(newHeight.toString());
    }
  }, [width, maintainAspectRatio, aspectRatio]);

  useEffect(() => {
    if (maintainAspectRatio && aspectRatio && height) {
      const newWidth = Math.round(height * aspectRatio);
      setWidth(newWidth.toString());
    }
  }, [height, maintainAspectRatio, aspectRatio]);

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    if (!imageFile.type.match('image/jpeg') && !imageFile.type.match('image/png')) {
      setError('只支持 JPEG 和 PNG 格式的图片');
      return;
    }

    setError('');
    const imageUrl = URL.createObjectURL(imageFile);
    const img = new Image();
    img.onload = () => {
      setWidth(img.width.toString());
      setHeight(img.height.toString());
      setAspectRatio(img.width / img.height);
      
      // 在图片加载完成后设置原始图片信息
      setOriginalImage({
        file: imageFile,
        url: imageUrl,
        width: img.width,
        height: img.height
      });
      
      // 自动调整图片尺寸
      setTimeout(() => {
        resizeImage();
      }, 100);
    };
    img.src = imageUrl;
  };


  const resizeImage = async () => {
    if (!originalImage || !width || !height) return;

    try {
      setLoading(true);
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = parseInt(width);
      canvas.height = parseInt(height);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, parseInt(width), parseInt(height));
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], originalImage.file.name, {
            type: originalImage.file.type,
          });

          setResizedImage({
            file: resizedFile,
            url: URL.createObjectURL(resizedFile),
            width: parseInt(width),
            height: parseInt(height)
          });
          setLoading(false);
        }, originalImage.file.type);
      };

      img.src = originalImage.url;
    } catch (error) {
      console.error('调整图片尺寸时出错:', error);
      setError('调整图片尺寸时出错，请重试');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.href = resizedImage.url;
    link.download = `resized_${originalImage.file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1d1d1f' }}>
          图片尺寸调整
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          调整图片尺寸，支持自定义宽高和等比缩放
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
              <FormControlLabel
                control={
                  <Switch
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    color="primary"
                  />
                }
                label="保持宽高比"
              />
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="宽度 (像素)"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    disabled={!originalImage}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="高度 (像素)"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    disabled={!originalImage}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  onClick={resizeImage}
                  disabled={!originalImage || loading}
                  startIcon={<AspectRatioIcon />}
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
                  调整尺寸
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#0071e3' }} />
        </Box>
      )}

      {originalImage && resizedImage && !loading && (
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
                    尺寸: {originalImage.width} × {originalImage.height} 像素
                  </Typography>
                </CardContent>
              </ImageCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageCard>
                <ImagePreview
                  image={resizedImage.url}
                  title="调整后图片"
                  sx={{ backgroundImage: `url(${resizedImage.url})` }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>调整后图片</Typography>
                  <Typography variant="body2" color="text.secondary">
                    尺寸: {resizedImage.width} × {resizedImage.height} 像素
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
              下载调整后的图片
            </Button>
          </Box>
        </>
      )}

      <Box sx={{ mt: 8, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} 图片尺寸调整工具 | 保护您的隐私，所有处理均在浏览器中完成
        </Typography>
      </Box>
    </Container>
  );
}

export default ImageResizer;