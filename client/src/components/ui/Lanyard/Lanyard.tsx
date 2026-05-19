/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import {
  BallCollider, CuboidCollider, Physics,
  RigidBody, useRopeJoint, useSphericalJoint,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'
import './Lanyard.css'

import cardGLB from '../../../assets/card.glb'
import lanyardPng from '../../../assets/lanyard.png'

extend({ MeshLineGeometry, MeshLineMaterial })

interface LanyardProps {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

function buildDhawanTexture() {
  const W = 512, H = 720
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0d0d0d')
  bg.addColorStop(0.55, '#1a0700')
  bg.addColorStop(1, '#FF6B00')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Top accent bar
  ctx.fillStyle = '#FF6B00'
  ctx.fillRect(0, 0, W, 6)

  // Logo area
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.beginPath()
  ctx.arc(W / 2, H * 0.38, 110, 0, Math.PI * 2)
  ctx.fill()

  // Large "42" jersey number silhouette
  ctx.fillStyle = 'rgba(255,107,0,0.18)'
  ctx.font = 'bold 220px Arial Black, Arial'
  ctx.textAlign = 'center'
  ctx.fillText('42', W / 2, H * 0.58)

  // Inner circle
  ctx.strokeStyle = 'rgba(255,107,0,0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(W / 2, H * 0.38, 80, 0, Math.PI * 2)
  ctx.stroke()

  // GS monogram
  ctx.fillStyle = '#FF6B00'
  ctx.font = 'bold 56px Arial Black, Arial'
  ctx.textAlign = 'center'
  ctx.fillText('GS', W / 2, H * 0.38 + 20)

  // Brand name top
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = 'bold 20px Arial'
  ctx.letterSpacing = '4px'
  ctx.textAlign = 'center'
  ctx.fillText('GABBAR SPORTZ', W / 2, 52)

  // Divider line
  ctx.strokeStyle = 'rgba(255,107,0,0.5)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(40, 64)
  ctx.lineTo(W - 40, 64)
  ctx.stroke()

  // Player name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px Arial Black, Arial'
  ctx.letterSpacing = '2px'
  ctx.fillText('SHIKHAR', W / 2, H - 130)
  ctx.fillText('DHAWAN', W / 2, H - 78)

  // Role/tag
  ctx.fillStyle = 'rgba(255,107,0,0.9)'
  ctx.font = '14px Arial'
  ctx.letterSpacing = '3px'
  ctx.fillText('BRAND AMBASSADOR', W / 2, H - 44)

  // Bottom bar
  ctx.fillStyle = '#FF6B00'
  ctx.fillRect(0, H - 6, W, 6)

  // Corner dots decoration
  const dots = [[30, 90], [W - 30, 90], [30, H - 90], [W - 30, H - 90]] as [number,number][]
  dots.forEach(([x, y]) => {
    ctx.fillStyle = 'rgba(255,107,0,0.3)'
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

interface BandProps {
  maxSpeed?: number
  minSpeed?: number
  isMobile?: boolean
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: BandProps) {
  const band = useRef<any>()
  const fixed = useRef<any>()
  const j1 = useRef<any>()
  const j2 = useRef<any>()
  const j3 = useRef<any>()
  const card = useRef<any>()

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  }

  const { nodes, materials } = useGLTF(cardGLB as string) as any
  const lanyardTexture = useTexture(lanyardPng as string)

  const dhawanTexture = useMemo(() => buildDhawanTexture(), [])

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  )
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z,
      })
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
        )
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        )
      })
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32))
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  lanyardTexture.wrapS = lanyardTexture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e: any) => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())),
              )
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={dhawanTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={lanyardTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}
