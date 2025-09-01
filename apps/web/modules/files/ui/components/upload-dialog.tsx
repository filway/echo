'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Button } from '@workspace/ui/components/button'
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@workspace/ui/components/dropzone'
import { api } from '@workspace/backend/_generated/api'
import { useAction } from 'convex/react'
import { useState } from 'react'

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileUploaded?: () => void
}

export const UploadDialog = ({
  open,
  onOpenChange,
  onFileUploaded,
}: UploadDialogProps) => {
  const addFile = useAction(api.private.files.addFile)

  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    category: '',
    filename: '',
  })

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]

    if (file) {
      setUploadFiles([file])
      if (!uploadForm.filename) {
        setUploadForm((prev) => ({ ...prev, filename: file.name }))
      }
    }
  }

  const handleUpload = async () => {
    setIsUploading(true)
    try {
      const blob = uploadFiles[0]

      if (!blob) return

      const filename = uploadForm.filename || blob.name

      await addFile({
        bytes: await blob.arrayBuffer(),
        filename,
        mimeType: blob.type || 'text/plain',
        category: uploadForm.category,
      })

      onFileUploaded?.()
      handleCancel()
    } catch (error) {
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setUploadFiles([])
    setUploadForm({
      category: '',
      filename: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload documents to your knowledge base for AI-powered search and
            retrieval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              className="w-full"
              id="category"
              placeholder="e.g., Documentation, Support, Product"
              value={uploadForm.category}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, category: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filename">
              Filename{' '}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              className="w-full"
              id="filename"
              placeholder="Override default filename"
              value={uploadForm.filename}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, filename: e.target.value }))
              }
            />
          </div>

          <Dropzone
            accept={{
              'application/pdf': ['.pdf'],
              'text/csv': ['.csv'],
              'text/plain': ['.txt'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx'],
            }}
            disabled={isUploading}
            maxFiles={1}
            onDrop={handleFileDrop}
            src={uploadFiles}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>

        <DialogFooter>
          <Button
            disabled={isUploading}
            onClick={handleCancel}
            variant={'outline'}
          >
            Cancel
          </Button>
          <Button
            disabled={
              uploadFiles.length === 0 || isUploading || !uploadForm.category
            }
            onClick={handleUpload}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
