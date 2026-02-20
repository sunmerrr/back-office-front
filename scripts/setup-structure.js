import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const srcDir = join(rootDir, 'src')

// 폴더 구조 정의
const folderStructure = {
  'app': [
    'router.tsx',
    'providers.tsx',
  ],
  'features': {
    'auth': [
      'components',
      'hooks',
      'api',
      'types',
      'pages',
    ],
    'tickets': [
      'components',
      'hooks',
      'api',
      'stores',
      'types',
      'pages',
    ],
    'messages': [
      'components',
      'hooks',
      'api',
      'stores',
      'types',
      'pages',
    ],
    'tournaments': [
      'components',
      'hooks',
      'api',
      'stores',
      'types',
      'pages',
    ],
    'users': [
      'components',
      'hooks',
      'api',
      'stores',
      'types',
      'pages',
    ],
  },
  'shared': {
    'components': [
      'layout',
      'ui',
    ],
    'api': [],
    'stores': [],
    'hooks': [],
    'utils': [],
    'types': [],
    'constants': [],
  },
  'styles': [],
}

// .gitkeep 파일 생성
async function createGitkeep(dir) {
  const gitkeepPath = join(dir, '.gitkeep')
  try {
    await writeFile(gitkeepPath, '', 'utf-8')
  } catch (error) {
    // .gitkeep 파일이 이미 존재할 수 있음
  }
}

// 폴더 생성 함수
async function createFolders(basePath, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const currentPath = join(basePath, name)
    
    try {
      await mkdir(currentPath, { recursive: true })
      console.log(`✓ Created: ${currentPath.replace(rootDir, '.')}`)
      
      // .gitkeep 파일 생성
      await createGitkeep(currentPath)
      
      if (Array.isArray(content)) {
        // 파일 목록인 경우
        for (const item of content) {
          const hasExtension = item.includes('.')
          
          if (hasExtension) {
            // 파일인 경우 (확장자가 있는 경우)
            const filePath = join(currentPath, item)
            try {
              await writeFile(filePath, '', 'utf-8')
              console.log(`  ✓ Created file: ${filePath.replace(rootDir, '.')}`)
            } catch (error) {
              // 파일이 이미 존재할 수 있음
            }
          } else {
            // 폴더인 경우
            const subPath = join(currentPath, item)
            await mkdir(subPath, { recursive: true })
            await createGitkeep(subPath)
            console.log(`  ✓ Created: ${subPath.replace(rootDir, '.')}`)
          }
        }
      } else if (typeof content === 'object') {
        // 중첩된 구조인 경우
        await createFolders(currentPath, content)
      }
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`✗ Error creating ${currentPath}:`, error.message)
      }
    }
  }
}

// 메인 실행 함수
async function main() {
  console.log('🚀 Creating folder structure...\n')
  
  try {
    await createFolders(srcDir, folderStructure)
    console.log('\n✅ Folder structure created successfully!')
  } catch (error) {
    console.error('\n❌ Error creating folder structure:', error)
    process.exit(1)
  }
}

main()
